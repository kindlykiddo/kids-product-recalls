import hashlib
import os
from pathlib import Path

from huggingface_hub import CommitOperationAdd, HfApi, hf_hub_download


ROOT = Path(__file__).resolve().parent.parent
REPO_ID = "kindlykiddo/kids-product-recalls"
FILES = {
    "distributions/huggingface/README.md": "README.md",
    "distributions/huggingface/data-dictionary.csv": "data-dictionary.csv",
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


def current_remote_digest(token: str) -> str | None:
    try:
        file_path = hf_hub_download(
            repo_id=REPO_ID,
            repo_type="dataset",
            filename=".sync-sha256",
            token=token,
        )
    except Exception:
        return None
    return Path(file_path).read_text(encoding="utf-8").strip()


def main() -> None:
    token = os.environ.get("HF_TOKEN")
    if not token:
        raise RuntimeError("HF_TOKEN is required")

    local_digest = digest()
    if current_remote_digest(token) == local_digest:
        print("Hugging Face dataset is already current.")
        return

    operations = [
        CommitOperationAdd(path_in_repo=destination, path_or_fileobj=str(ROOT / source))
        for source, destination in FILES.items()
    ]
    operations.append(CommitOperationAdd(path_in_repo=".sync-sha256", path_or_fileobj=local_digest.encode()))

    HfApi(token=token).create_commit(
        repo_id=REPO_ID,
        repo_type="dataset",
        operations=operations,
        commit_message="Sync weekly KindlyKiddo recall data",
    )
    print(f"Synced {len(FILES)} files to {REPO_ID}.")


if __name__ == "__main__":
    main()
