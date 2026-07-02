from fastapi import APIRouter, UploadFile, File
from typing import List
import os
import shutil

from embeddings import load_document, split_documents
from vector_store import create_vector_store

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_documents(files: List[UploadFile] = File(...)):

    all_chunks = []
    uploaded_files = []

    allowed_extensions = [".pdf", ".docx", ".txt"]

    for file in files:

        extension = os.path.splitext(file.filename)[1].lower()

        if extension not in allowed_extensions:
            continue

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        documents = load_document(file_path)

        chunks = split_documents(documents)

        all_chunks.extend(chunks)

        uploaded_files.append(file.filename)

    if all_chunks:
        create_vector_store(all_chunks)

    return {
        "message": "Documents uploaded successfully!",
        "files": uploaded_files,
        "chunks_created": len(all_chunks)
    }