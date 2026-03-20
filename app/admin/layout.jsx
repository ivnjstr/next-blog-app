import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";

export default function Layout({ children }) {
    return (
        <>
            <div className="flex">
                <Sidebar />
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between w-full py-3 max-h-15 px-12 border-b border-blacl ">
                        <h3 className="font-medium">Admin Panel</h3>
                        <Image src={assets.profile_icon} width={40} alt="" />
                    </div>
                    {children}
                </div>
            </div>

        </>
    )
}