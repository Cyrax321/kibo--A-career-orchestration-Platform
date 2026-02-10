import os
import re
from django.core.management.base import BaseCommand
from django.template.defaultfilters import slugify
from learning.models import Module, Lesson  # Assuming you have an app named 'learning'

class Command(BaseCommand):
    help = 'Parses complete_python_course.txt and loads it into the database'

    def handle(self, *args, **options):
        file_path = 'complete_python_course.txt'
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File "{file_path}" not found.'))
            return

        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Split content by the module separator pattern
        # The file separates modules with "================================================================================"
        # We need to robustly split this.
        raw_modules = re.split(r'={80,}\n', content)

        # Filter out empty sections (like start/end of file)
        raw_modules = [m.strip() for m in raw_modules if m.strip()]

        # Skip the intro header if it exists (KIBO PYTHON COURSE...)
        if "KIBO PYTHON COURSE" in raw_modules[0]:
            raw_modules.pop(0)

        for module_text in raw_modules:
            self.parse_and_save_module(module_text)

        self.stdout.write(self.style.SUCCESS(f'Successfully loaded {len(raw_modules)} modules.'))

    def parse_and_save_module(self, text):
        lines = text.split('\n')
        
        # 1. Extract Module Title
        # Format: "MODULE X: TITLE"
        title_line = lines[0]
        if not title_line.startswith("MODULE"):
            return # Skip invalid chunks

        # Logic to parse the specific title format
        # e.g., "MODULE 1: PYTHON INTRO" -> title="Python Intro", order=1
        try:
            module_header = title_line.split(':')
            module_num = int(module_header[0].replace("MODULE", "").strip())
            title = module_header[1].strip()
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"Skipping malformed header: {title_line}"))
            return

        # 2. Extract Content Sections
        # The rest of the text needs to be parsed for [EXAMPLE CODE] and [EXERCISE]
        
        # Remove the title line and the separator line underneath it (----)
        content_lines = lines[2:] 
        full_content = "\n".join(content_lines)

        # Regex parsing for specific blocks
        example_code_match = re.search(r'\[EXAMPLE CODE\]\n(.*?)(?=\n\[|$)', full_content, re.DOTALL)
        exercise_match = re.search(r'\[EXERCISE\]\n(.*?)(?=\n\[|$)', full_content, re.DOTALL)
        
        # The explanation text is everything BEFORE the first special block
        # We can split by the first occurrence of either [EXAMPLE or [EXERCISE
        explanation_end_index = len(full_content)
        if example_code_match:
            explanation_end_index = min(explanation_end_index, full_content.find('[EXAMPLE CODE]'))
        if exercise_match:
            explanation_end_index = min(explanation_end_index, full_content.find('[EXERCISE]'))
            
        explanation_text = full_content[:explanation_end_index].strip()
        
        # 3. HTML Conversion (Basic)
        html_content = self.convert_to_html(explanation_text)

        # 4. Extract Code and Exercise Data
        example_code = example_code_match.group(1).strip() if example_code_match else ""
        exercise_text = exercise_match.group(1).strip() if exercise_match else ""

        # 5. Save to DB
        # This assumes a model structure. Adjust as needed.
        lesson, created = Lesson.objects.update_or_create(
            slug=slugify(title),
            defaults={
                'title': title,
                'order': module_num,
                'content_html': html_content,
                'example_code': example_code,
                'exercise_task': exercise_text
            }
        )
        
        action = "Created" if created else "Updated"
        self.stdout.write(f"{action} Lesson: {title}")

    def convert_to_html(self, text):
        """
        Simple text-to-HTML converter for the Kibo format.
        """
        lines = text.split('\n')
        html_lines = []
        
        in_list = False

        for line in lines:
            line = line.strip()
            
            if not line:
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                continue

            # Headers (Lines that don't end in punctuation usually, or based on casing? 
            # Prompt says "Headers start with..." but the text format is loose.
            # Let's assume lines starting with big caps or specific keywords are headers?
            # Or simplified: First line of a block is H2?
            # Let's use a heuristic: Short lines without punctuation are H2
            if len(line) < 50 and not line.endswith('.') and not line.startswith('*'):
                 html_lines.append(f"<h2>{line}</h2>")
                 continue

            # Lists
            if line.startswith('* '):
                if not in_list:
                    html_lines.append("<ul>")
                    in_list = True
                html_lines.append(f"<li>{line[2:]}</li>")
                continue
            else:
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False

            # Normal Paragraphs
            html_lines.append(f"<p>{line}</p>")

        if in_list:
             html_lines.append("</ul>")

        return "\n".join(html_lines)
