import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { analyzeInventory } from '../services/geminiService';
import { Bot, Sparkles, RefreshCw } from 'lucide-react';

interface AIAdvisorProps {
  items: InventoryItem[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ items }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeInventory(items);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-xl border border-indigo-700/50 p-6 mb-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Bot size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Oráculo del Gremio (IA)</h3>
              <p className="text-indigo-200 text-sm">Análisis estratégico de recursos con Gemini</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Bot size={18} />}
            {loading ? 'Consultando...' : analysis ? 'Actualizar Análisis' : 'Analizar Inventario'}
          </button>
        </div>

        {analysis && (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 border border-indigo-500/30 text-slate-200 leading-relaxed whitespace-pre-wrap animate-in fade-in duration-500">
            {analysis}
          </div>
        )}
        
        {!analysis && !loading && (
          <div className="text-slate-400 italic text-sm mt-2">
            Haz clic en "Analizar Inventario" para recibir consejos sobre qué recolectar a continuación o identificar déficits.
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;