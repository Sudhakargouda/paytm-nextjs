interface Val{
    value: number | null
}

export default function Balance({value}: Val){
    return (
        <div className="flex my-8 mx-14">
            <div className=" font-bold text-lg  text-black">
                 Your balance
            </div>

            <div className="font-semibold ml-2 text-black text-lg">
                Rs {value}
            </div>
        </div>
    )
}