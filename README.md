# 🔥 Roast My Fridge

An AI-powered recipe generator with attitude! Enter your random ingredients, get hilariously roasted by an AI chef, then receive an actual delicious recipe.

## 🎯 Features

- **🤖 AI-Powered Roasting**: Uses Google Gemini 2.5 Flash to create sarcastic, Gordon Ramsay-style roasts
- **👨‍🍳 Recipe Generation**: Converts your questionable ingredients into real, edible recipes
- **✨ Beautiful UI**: Modern glassmorphic design with smooth animations
- **⚡ Fast Response**: Optimized API with lazy loading for quick results

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Lucide React** (Icons)

### Backend
- **Python 3.9+**
- **FastAPI**
- **Pydantic AI**
- **Google Gemini API**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Google Gemini API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Shreshtha03/roast-my-fridge.git
cd roast-my-fridge
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file in the root directory:
```env
GEMINI_API_KEY=your_api_key_here
```

5. Run the development servers:

**Backend** (Terminal 1):
```bash
uvicorn api.index:app --reload --port 8000
```

**Frontend** (Terminal 2):
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

### Vercel Deployment

1. Push to GitHub (already done!)
2. Import project in Vercel
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy!

## 🎨 UI Features

- Animated gradient background
- Glassmorphic cards
- Smooth hover effects
- Responsive design
- Loading states with animations

## 🤝 Contributing

Built for a university AI assignment showcasing:
- Full-stack development
- AI integration
- Modern UI/UX
- Production deployment

## 📝 License

MIT License

## 👨‍💻 Author

**Shreshtha Srivastava**
- GitHub: [@Shreshtha03](https://github.com/Shreshtha03)

---

Made with 🔥 using Pydantic AI + Google Gemini
