from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

CHROMA_PATH = "chroma_db"

embeddings = OllamaEmbeddings(
    model="nomic-embed-text"
)


def create_vector_store(chunks):
    """
    Add document chunks to the existing Chroma database.
    If the database doesn't exist yet, Chroma will create it automatically.
    """

    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )

    db.add_documents(chunks)

    return db