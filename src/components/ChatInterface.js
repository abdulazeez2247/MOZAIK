import React, { useState, useRef, useEffect } from "react";
import { questionsAPI } from "../services/api";

const ChatInterface = ({ userPlan = "free", onUpgradeClick }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await questionsAPI.askQuestion({
        message: inputMessage,
        platform: "mozaik",
        version: null,
      });

      const { data } = response.data;
      if (data && data.answer) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.answer,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          modelUsed: data.modelUsed,
          tokensUsed: data.tokens || 0,
          answerId: data.answerId,
          isCacheHit: data.isCacheHit,
          sources: data.sources || [],
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      if (error.response?.data?.upgradeRequired) {
        const botMessage = {
          id: Date.now() + 1,
          text: `I'd love to help with "${inputMessage}", but you've reached your daily limit. Upgrade to continue getting expert millwork guidance.`,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          modelUsed: "gpt-4o-mini",
          upgradeRequired: true,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botMessage = {
          id: Date.now() + 1,
          text: error.message || "Something went wrong. Please try again.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          modelUsed: "gpt-4o-mini",
          error: true,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (answerId, vote) => {
    try {
      await questionsAPI.voteAnswer(answerId, { vote });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.answerId === answerId ? { ...msg, userVote: vote } : msg
        )
      );
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const getUpgradePrompt = () => {
    if (userPlan !== "free") return null;

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Upgrade to Pro for Enhanced Features
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Pro answers include Mozaik menu paths step-by-step, joinery and
                CNC checks, and install notes. Free answers are brief and
                generic.
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={onUpgradeClick}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMessageContent = (message) => {
    if (message.upgradeRequired) {
      return (
        <div>
          <p>{message.text}</p>
          <button
            onClick={onUpgradeClick}
            className="mt-2 bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
          >
            Upgrade to Continue
          </button>
        </div>
      );
    }

    if (message.error) {
      return (
        <div className="text-red-600">
          <p>{message.text}</p>
        </div>
      );
    }

    return (
      <div>
        <p className="text-sm">{message.text}</p>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">Sources:</p>
            <ul className="text-xs text-gray-400">
              {message.sources.map((source, index) => (
                <li key={index}>• {source}</li>
              ))}
            </ul>
          </div>
        )}
        {message.answerId && (
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => handleVote(message.answerId, "up")}
              className={`text-xs px-2 py-1 rounded ${
                message.userVote === "up"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              👍 Helpful
            </button>
            <button
              onClick={() => handleVote(message.answerId, "down")}
              className={`text-xs px-2 py-1 rounded ${
                message.userVote === "down"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              👎 Not Helpful
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Moe Chat
              </span>
            </h1>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                userPlan === "free" 
                  ? "bg-yellow-100 text-yellow-800" 
                  : "bg-green-100 text-green-800"
              }`}>
                {userPlan === "free"
                  ? "Free Plan (5 queries/day)"
                  : `${
                      userPlan.charAt(0).toUpperCase() + userPlan.slice(1)
                    } Plan`}
              </span>
              <span className="text-sm text-gray-500">
                Model: {userPlan === "free" ? "gpt-4o-mini" : "gpt-4o"}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {userPlan === "free" && (
              <button
                onClick={onUpgradeClick}
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center mt-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start a conversation with Moe</h3>
            <p className="text-gray-600 max-w-md mx-auto">Ask questions about Mozaik, VCarve, Fusion 360, or any millwork project. Get expert guidance instantly.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-2xl px-6 py-4 rounded-2xl shadow-sm ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              } ${message.error ? "border border-red-300 bg-red-50" : ""}`}
            >
              {renderMessageContent(message)}
              <div
                className={`text-xs mt-3 flex items-center ${
                  message.sender === "user"
                    ? "text-primary-100"
                    : "text-gray-500"
                }`}
              >
                <span>{message.timestamp}</span>
                {message.sender === "bot" && message.modelUsed && (
                  <span className="ml-2 flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    {message.modelUsed}
                  </span>
                )}
                {message.sender === "bot" && message.isCacheHit && (
                  <span className="ml-2 flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    Cached
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-6 py-4 rounded-2xl shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 ml-2">Moe is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {userPlan === "free" && messages.length > 0 && getUpgradePrompt()}

      <div className="bg-white border-t border-gray-200 px-6 py-6 shadow-lg">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Moe about your millwork project..."
              className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 shadow-sm"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-2xl font-semibold hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </div>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
