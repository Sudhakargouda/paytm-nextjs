
interface Head{
    label: string
}

export default function Heading({label}: Head){
    return <div className="font-bold text-slate-900 text-4xl pt-6">
        {label}
    </div>
}