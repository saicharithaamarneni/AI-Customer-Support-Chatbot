from dotenv import load_dotenv
import os

from langchain_chroma import Chroma
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

CHROMA_PATH = "chroma_db"

embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = Chroma(
    persist_directory=CHROMA_PATH,
    embedding_function=embedding
)

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.4
)

# Stores conversation history
chat_history = []


def ask_question(question: str):

    global chat_history

    # Retrieve relevant document chunks
    docs = db.similarity_search(question, k=3)

    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    # Build previous conversation
    history = ""

    for item in chat_history[-6:]:
        history += f"{item['role']}: {item['content']}\n"

    # Build prompt
    prompt = f"""
You are a friendly AI Customer Support Assistant.

There are TWO kinds of questions.

1. General conversation
Examples:
- Hi
- Hello
- Thanks
- Thank you
- Bye
- How are you

Reply naturally like ChatGPT.

2. Questions about uploaded documents

Use ONLY the document context below.

If the answer is not found in the document,
politely say so.

Conversation History:
{history}

Document Context:
{context}

User:
{question}
"""

    # Ask the LLM
    response = llm.invoke(prompt)

    answer = response.content

    if not answer:
        answer = "I couldn't generate a response."

    # Save conversation
    chat_history.append({
        "role": "User",
        "content": question
    })

    chat_history.append({
        "role": "Assistant",
        "content": answer
    })
    

    return answer
def stream_answer(question: str):

    global chat_history

    docs = db.similarity_search(question, k=3)

    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    history = ""

    for item in chat_history[-6:]:
        history += f"{item['role']}: {item['content']}\n"

    prompt = f"""
You are a friendly AI Customer Support Assistant.

There are TWO kinds of questions.

1. General conversation:
Examples:
Hi
Hello
Thanks
Bye

Reply naturally.

2. Document questions:
Use ONLY the document context.

If the answer isn't found,
say politely you couldn't find it.

Conversation History:
{history}

Document Context:
{context}

User:
{question}
"""

    answer = ""

    for chunk in llm.stream(prompt):

        text = chunk.content

        answer += text

        yield text

    chat_history.append({
        "role": "User",
        "content": question
    })

    chat_history.append({
        "role": "Assistant",
        "content": answer
    })