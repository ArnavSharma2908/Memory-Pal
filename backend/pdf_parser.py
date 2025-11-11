import io, os, statistics, json
from typing import List, Dict
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTChar
import cohere
from dotenv import load_dotenv

load_dotenv()
co = cohere.Client(os.getenv("COHERE_API_KEY"))

def get_major_topics(outline_text: str) -> List[str]:
    try:
        prompt = f"""You have this outline of topics from a document:
{outline_text}

Identify and return ONLY the 4-6 most major, important topics that should be studied first. These should be the main chapters/sections, not sub-topics.

Return ONLY a JSON array of strings, no markdown:
["Topic 1", "Topic 2", "Topic 3", "Topic 4"]"""
        
        response = co.chat(message=prompt, model="command-r-08-2024")
        try:
            major = json.loads(response.text)
            if isinstance(major, list) and 4 <= len(major) <= 6:
                return major
        except json.JSONDecodeError:
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            major = json.loads(text)
            return major if isinstance(major, list) else []
    except Exception as e:
        print(f"Error getting major topics: {e}")
    return []

def parse(pdf_bytes, metadata=None) -> List[Dict[str, str]]:
    if not pdf_bytes:
        return []
    try:
        lines = []
        for page_layout in extract_pages(io.BytesIO(pdf_bytes)):
            for element in page_layout:
                if not isinstance(element, LTTextContainer):
                    continue
                for text_line in element:
                    txt = getattr(text_line, "get_text", lambda: "")().strip()
                    if not txt:
                        continue
                    sizes, bold = [], False
                    for ch in text_line:
                        if isinstance(ch, LTChar):
                            sizes.append(round(getattr(ch, "size", 0), 2))
                            if "Bold" in (getattr(ch, "fontname", "") or ""):
                                bold = True
                    lines.append({"text": txt, "size": statistics.median(sizes) if sizes else 0, "bold": bold})

        if not lines:
            return []

        sizes = sorted([l["size"] for l in lines if l.get("size")], reverse=True)
        h1_threshold = sizes[max(0, len(sizes) // 10)] if sizes else 0
        h2_threshold = sizes[max(0, len(sizes) // 3)] if sizes else 0

        def get_heading_level(l):
            s = l.get("size", 0)
            return 1 if s >= h1_threshold else 2 if s >= h2_threshold else 0

        for l in lines:
            l["level"] = get_heading_level(l)

        outline_text = ", ".join(l["text"].strip() for l in lines if l.get("level") in (1, 2)) or "No outline"
        
        major_topics = get_major_topics(outline_text)
        
        return major_topics
    except Exception as e:
        return []