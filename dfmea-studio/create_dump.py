# create_dump.py
# Run: python create_dump.py
# Output: dfmea_dump.txt (in project root)

from __future__ import annotations

from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).resolve().parent

INCLUDE_DIRS = [
    PROJECT_ROOT / "src" / "components",
    PROJECT_ROOT / "src" / "contexts",
    PROJECT_ROOT / "src" / "data",
]

PROJECT_ROOT = Path(__file__).resolve().parent


#EDIT THIS 
INCLUDE_DIRS = [
    PROJECT_ROOT / "src" / "components",
    PROJECT_ROOT / "src" / "contexts",
 
]

INCLUDE_FILES = [
    PROJECT_ROOT / "src" / "App.jsx",
]

OUTPUT_FILE = PROJECT_ROOT / "dfmea_dump.txt"

TEXT_EXTS = {
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
    ".css",
    ".html",
    ".md",
    ".txt",
}

SKIP_NAMES = {
    "node_modules",
    "dist",
    "build",
    ".git",
    ".vite",
}


def is_text_file(p: Path) -> bool:
    return p.suffix.lower() in TEXT_EXTS


def read_text_safe(p: Path) -> str:
    try:
        return p.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return p.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        return f"[ERROR reading file: {e}]"


def iter_files(base: Path):
    if not base.exists():
        return
    for p in base.rglob("*"):
        if p.is_dir():
            continue
        if any(part in SKIP_NAMES for part in p.parts):
            continue
        if is_text_file(p):
            yield p


def write_section(out, title: str):
    out.write("\n")
    out.write("=" * 90 + "\n")
    out.write(title + "\n")
    out.write("=" * 90 + "\n")


def main():
    files: list[Path] = []

    for d in INCLUDE_DIRS:
        files.extend(list(iter_files(d)))

    for f in INCLUDE_FILES:
        if f.exists() and f.is_file():
            files.append(f)

    # de-dupe + sort nicely
    files = sorted(set(files), key=lambda p: str(p).lower())

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with OUTPUT_FILE.open("w", encoding="utf-8") as out:
        out.write("DFMEA STUDIO SOURCE DUMP\n")
        out.write(f"Generated: {now}\n")
        out.write(f"Root: {PROJECT_ROOT}\n")
        out.write("\nIncluded paths:\n")
        for d in INCLUDE_DIRS:
            out.write(f" - {d.relative_to(PROJECT_ROOT)}\n")
        for f in INCLUDE_FILES:
            out.write(f" - {f.relative_to(PROJECT_ROOT)}\n")

        out.write("\nFiles:\n")
        for p in files:
            out.write(f" - {p.relative_to(PROJECT_ROOT)}\n")

        for p in files:
            rel = p.relative_to(PROJECT_ROOT)
            write_section(out, f"FILE: {rel}")
            out.write(read_text_safe(p).rstrip() + "\n")

    print(f"✅ Dump created: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
