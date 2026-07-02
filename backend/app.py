from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from upload import router as upload_router
from chatbot import ask_question, stream_answer
from chatbot import chat_history

app = FastAPI(
    title="AI Customer Support Chatbot API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)


class Question(BaseModel):
    question: str


@app.get("/")
def home():
    return {
        "message": "Welcome to AI Customer Support Chatbot!"
    }


@app.post("/chat")
def chat(data: Question):
    answer = ask_question(data.question)

    return {
        "answer": answer
    }


@app.post("/chat-stream")
def chat_stream(data: Question):

    return StreamingResponse(
        stream_answer(data.question),
        media_type="text/plain"
    )


@app.post("/clear")
def clear_chat():

    chat_history.clear()

    return {
        "message": "Chat cleared"
    }