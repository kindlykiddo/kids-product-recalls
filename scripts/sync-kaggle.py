import hashlib
import os
import shutil
import subprocess
import tempfile
from datetime import UTC, datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DATASET_ID = "kindlykiddo/kids-product-recalls"
FILES = {
    "distributions/kaggle/dataset-metadata.json": "dataset-metadata.json",
    "distributions/kaggle/README.md": "README.md",
    "distributions/kaggle/data-dictionary.csv": "data-dictionary.csv",
    "data/kids-product-recalls.csv": "kids-product-recalls.csv",
    "data/kids-product-recalls.json": "kids-product-recalls.json",
    "LICENSE-DATA.md": "LICENSE-DATA.md",
    "CITATION.cff": "CITATION.cff",
}


def digest() -> str:
    value = hashlib.sha256()
    for source, destination in sorted(FILES.items()):
        value.update(destination.encode())
        value.update(b"\0")
        value.update((ROOT / source).read_bytes())
        value.update(b"\0")
    return value.hexdigest()


def run(command: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, check=check, capture_output=True, text=True)


def dataset_exists() -> bool:
    result = run(["kaggle", "datasets", "status", DATASET_ID], check=False)
    return result.returncode == 0


def current_remote_digest(folder: Path) -> str | None:
    result = run(
        [
            "kaggle",
            "datasets",
            "download",
            DATASET_ID,
            "-f",
            "sync-sha256.txt",
            "-p",
            str(folder),
            "-q",
            "-o",
        ],
        check=False,
    )
    digest_path = folder / "sync-sha256.txt"
    return digest_path.read_text(encoding="utf-8").strip() if result.returncode == 0 and digest_path.exists() else None


def stage(folder: Path, local_digest: str) -> None:
    for source, destination in FILES.items():
        shutil.copy2(ROOT / source, folder / destination)
    (folder / "sync-sha256.txt").write_text(f"{local_digest}\n", encoding="utf-8")


def main() -> None:
    if not os.environ.get("KAGGLE_API_TOKEN"):
        raise RuntimeError("KAGGLE_API_TOKEN is required")

    local_digest = digest()
    with tempfile.TemporaryDirectory(prefix="kindlykiddo-kaggle-") as temporary:
        folder = Path(temporary)
        exists = dataset_exists()
        if exists and current_remote_digest(folder) == local_digest:
            print("Kaggle dataset is already current.")
            return

        stage(folder, local_digest)
        if exists:
            message = f"Weekly refresh {datetime.now(UTC).date().isoformat()}"
            run(["kaggle", "datasets", "version", "-p", str(folder), "-m", message, "-q", "-t", "-r", "skip"])
            print(f"Published a new version of {DATASET_ID}.")
        else:
            run(["kaggle", "datasets", "create", "-p", str(folder), "--public", "-q", "-t", "-r", "skip"])
            print(f"Created public Kaggle dataset {DATASET_ID}.")


if __name__ == "__main__":
    main()
