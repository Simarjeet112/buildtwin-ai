export default function ResultPanel({ result }) {

    return (
    
    <div className="bg-zinc-900 p-6 rounded-lg mt-6 whitespace-pre-wrap">
    
    <h2 className="text-xl mb-4 font-semibold">
    AI Analysis
    </h2>
    
    <p className="text-zinc-300">
    {result}
    </p>
    
    </div>
    
    )
    
    }