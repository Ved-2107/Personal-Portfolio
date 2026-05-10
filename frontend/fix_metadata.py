import os
import re

APP_DIR = r"C:\Users\Ved Bajaj\Downloads\ved-portfolio\frontend\src\app"

metadata_pattern = re.compile(r"(import type \{ Metadata \} from 'next';\n)?(export const metadata: Metadata = \{.*?\};\n)", re.DOTALL)
use_client_pattern = re.compile(r"'use client';\n")

for root, dirs, files in os.walk(APP_DIR):
    if "page.tsx" in files:
        page_path = os.path.join(root, "page.tsx")
        with open(page_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if "'use client';" in content and "export const metadata: Metadata =" in content:
            print(f"Fixing {page_path}")
            
            # Extract metadata
            metadata_match = metadata_pattern.search(content)
            if not metadata_match:
                print("Could not extract metadata block properly")
                continue
            
            metadata_block = metadata_match.group(0)
            
            # Remove metadata from page.tsx
            new_content = content.replace(metadata_block, "")
            
            # Ensure 'use client'; is at the top
            new_content = new_content.replace("'use client';\n", "")
            new_content = "'use client';\n" + new_content.lstrip()
            
            with open(page_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
            # Create layout.tsx
            layout_path = os.path.join(root, "layout.tsx")
            # If we don't have the import in the matched block, add it
            imports = ""
            if "import type { Metadata }" not in metadata_block:
                imports = "import type { Metadata } from 'next';\n"
                
            layout_content = f"{imports}{metadata_block}\nexport default function Layout({{ children }}: {{ children: React.ReactNode }}) {{\n  return children;\n}}\n"
            
            if not os.path.exists(layout_path):
                with open(layout_path, 'w', encoding='utf-8') as f:
                    f.write(layout_content)
                print(f"Created {layout_path}")
            else:
                print(f"Warning: {layout_path} already exists! Did not overwrite.")
