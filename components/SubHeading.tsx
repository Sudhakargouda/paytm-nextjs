
interface SubHead{
    label: string
}

export default function SubHeading({label}: SubHead){
    return (
        <div className="text-md  text-slate-600  pt-1 px-4 pb-4 ">
            {label}
        </div>  
    )
}