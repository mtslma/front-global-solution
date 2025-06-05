import { ActionLinkProps } from "@/types/types";
import Link from "next/link";

// 2. Use a interface para tipar as props e desestruture-as
export default function ActionLink({ href, iconClassName, title, description }: ActionLinkProps) {
    return (
        <Link href={href}>
            <div className="block p-5 bg-white hover:bg-indigo-50 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-xl hover:scale-[1.03] border border-gray-200 group">
                <div className="flex items-center justify-center space-x-4">
                    {iconClassName && (
                        <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
                            <i className={`fa-solid ${iconClassName} text-indigo-600 text-xl w-6 h-6 flex text-center items-center justify-center`}></i>
                        </div>
                    )}
                    <div>
                        <h4 className="text-lg font-semibold text-indigo-700 group-hover:text-indigo-800">{title}</h4>
                        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                    </div>
                </div>
            </div>
        </Link>
    );
}
