'use client';

import { useState } from 'react';
import { ChefHat, Flame, Send, Utensils, AlertTriangle } from 'lucide-react';

interface RecipeData {
  roast: string;
  recipe_name: string;
  ingredients_list: string[];
  instructions: string[];
}

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RecipeData | null>(null);
  const [error, setError] = useState('');

  const handleRoast = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: input }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch roast. The chef is on break.');
      }

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 font-sans selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="z-10 max-w-6xl w-full flex justify-between items-center mb-16">
        <div className="flex items-center gap-3 px-6 py-3 bg-neutral-900/50 backdrop-blur-xl border border-rose-500/30 rounded-full">
          <ChefHat className="text-rose-500 w-6 h-6" />
          <span className="font-bold text-lg tracking-wide">Roast My Fridge</span>
        </div>
        <a
          className="text-neutral-400 hover:text-rose-500 transition-all duration-300 text-sm"
          href="https://ai.pydantic.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Pydantic AI + Gemini
        </a>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mb-16 z-10">
        <div className="mb-6 inline-block">
          <Flame className="w-20 h-20 text-rose-500 animate-pulse mx-auto mb-4" />
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-orange-500 to-yellow-500 leading-tight">
          ROAST MY FRIDGE
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
          Enter your questionable ingredients. Get brutally roasted. <br />
          <span className="text-rose-400 font-semibold">Then get an actual recipe.</span>
        </p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-2xl mb-12 z-10">
        <div className="bg-neutral-900/40 backdrop-blur-2xl rounded-3xl border border-rose-500/20 p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRoast()}
              placeholder="e.g., banana, ketchup, leftover pizza..."
              className="flex-1 bg-neutral-800/50 border border-neutral-700 rounded-2xl px-8 py-6 text-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleRoast}
              disabled={loading}
              className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-rose-500/50 hover:scale-105 active:scale-95 min-w-[180px]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Roasting...</span>
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5" />
                  <span>ROAST ME</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-2xl mb-8 z-10">
          <div className="bg-red-900/20 backdrop-blur-xl border border-red-500/50 rounded-2xl px-6 py-4 flex items-center gap-3 animate-in slide-in-from-top">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="w-full max-w-6xl z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {/* The Roast Card */}
          <div className="mb-8 bg-gradient-to-br from-rose-900/30 to-orange-900/30 backdrop-blur-2xl border border-rose-500/30 rounded-3xl p-8 shadow-2xl hover:shadow-rose-500/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-rose-400 animate-pulse" />
              <h2 className="text-xl font-bold text-rose-400 uppercase tracking-wider">The Roast</h2>
            </div>
            <p className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed">
              "{data.roast}"
            </p>
          </div>

          {/* Recipe Card */}
          <div className="bg-neutral-900/40 backdrop-blur-2xl border border-orange-500/20 rounded-3xl p-10 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <Utensils className="w-8 h-8 text-orange-400" />
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
                {data.recipe_name}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Ingredients */}
              <div className="bg-neutral-800/30 rounded-2xl p-6 border border-neutral-700/50">
                <h3 className="text-lg font-bold text-orange-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Ingredients
                </h3>
                <ul className="space-y-3">
                  {data.ingredients_list.map((ing, i) => (
                    <li key={i} className="flex items-start gap-3 text-white text-base">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="bg-neutral-800/30 rounded-2xl p-6 border border-neutral-700/50">
                <h3 className="text-lg font-bold text-orange-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Instructions
                </h3>
                <ol className="space-y-4">
                  {data.instructions.map((step, i) => (
                    <li key={i} className="text-white text-base leading-relaxed flex gap-3">
                      <span className="font-bold text-orange-400 flex-shrink-0">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
