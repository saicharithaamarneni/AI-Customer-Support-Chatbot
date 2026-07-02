from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

CHROMA_PATH = "chroma_db"

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def create_vector_store(chunks):
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings,
    )

    db.add_documents(chunks)

    return db