import React, { useState } from 'react';
import { Videoigra } from './types';

const ŽANRI = ["RPG", "FPS", "Strategija", "Groza", "Simulacija", "Avantura"];
const ČASI_IGRANJA = ["Kratko (0-10 ur)", "Srednje (10-30 ur)", "Dolgo (30+ ur)"];
const PLATFORME = ["PC", "PlayStation", "Xbox", "Switch", "Mobile"];

function App() {
  const [žanr, setŽanr] = useState(ŽANRI[0]);
  const [časIgranja, setČasIgranja] = useState(ČASI_IGRANJA[0]);
  const [platforme, setPlatforme] = useState<string[]>([]);
  const [razpoloženje, setRazpoloženje] = useState('Sprostitev');
  
  const [predlogi, setPredlogi] = useState<Videoigra[]>([]);
  const [nalaganje, setNalaganje] = useState(false);
  const [napaka, setNapaka] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNalaganje(true);
    setNapaka('');
    setPredlogi([]);

    try {
      const response = await fetch('http://localhost:3001/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ žanr, časIgranja, platforme, razpoloženje }),
      });

      if (!response.ok) {
        throw new Error('Mrežna napaka ali napaka strežnika');
      }

      const data: Videoigra[] = await response.json();
      setPredlogi(data);

    } catch (err: any) {
      setNapaka('Prišlo je do napake: Preverite Backend Server (Node.js/Gemini API).');
      console.error(err);
    } finally {
      setNalaganje(false);
    }
  };

  const handlePlatformChange = (platform: string) => {
    setPlatforme(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-400">
          Generator predlogov iger
        </h1>
        
        {}
        <form 
          onSubmit={handleSubmit} 
          className="bg-gray-800 p-6 rounded-xl shadow-2xl space-y-6 mb-10 border border-indigo-700"
        >
          <div className="grid md:grid-cols-2 gap-6">
            
            {}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Žanr:</label>
              <select 
                value={žanr} 
                onChange={e => setŽanr(e.target.value)}
                className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                {ŽANRI.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Čas Igranja:</label>
              <select 
                value={časIgranja} 
                onChange={e => setČasIgranja(e.target.value)}
                className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                {ČASI_IGRANJA.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          
          {/* Razpoloženje/Občutek */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Željeno Razpoloženje/Kontekst:</label>
            <input 
              type="text" 
              value={razpoloženje} 
              onChange={e => setRazpoloženje(e.target.value)}
              placeholder="Npr. Izziv, Sprostitev, Pripoved, Co-op za dva igralca"
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Platforme (Checkboxes) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Platforme (Izberi vsaj eno):</label>
            <div className="flex flex-wrap gap-4">
              {PLATFORME.map(p => (
                <div 
                  key={p} 
                  className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    platforme.includes(p) 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => handlePlatformChange(p)}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Gumb za oddajo */}
          <button 
            type="submit" 
            disabled={nalaganje || platforme.length === 0}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
              nalaganje || platforme.length === 0
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/50'
            }`}
          >
            {nalaganje ? 'Generiram predloge s pomočjo LLM...' : 'Predlagaj Igre'}
          </button>

          {/* Status in Napake */}
          {(nalaganje || napaka) && (
             <div className="text-center p-3 rounded-lg">
                {nalaganje && <p className="text-indigo-400 font-medium">Iščem najboljše predloge za vas...</p>}
                {napaka && <p className="text-red-400 font-medium">{napaka}</p>}
             </div>
          )}
        </form>

        {/* Prikaz rezultatov */}
        {predlogi.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-indigo-400 text-center">Priporočene Igre ({predlogi.length}):</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {predlogi.map((igra, index) => (
                <div key={index} className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                  <h3 className="text-xl font-bold mb-2 text-indigo-300">{igra.naslov}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full">{igra.žanr}</span>
                    {igra.platforme.map(p => (
                      <span key={p} className="text-xs bg-green-900/50 text-green-300 px-3 py-1 rounded-full">{p}</span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm italic">{igra.kratek_opis}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;