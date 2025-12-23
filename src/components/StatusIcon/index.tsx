import { FilterStatus } from "@/types/FilterStatus";
import { CircleCheck, CircleDashed } from "lucide-react-native";

export default function StatusIcon({status}: {status: FilterStatus}) {
    return status === FilterStatus.DONE ? (
        <CircleCheck color="#2C46B1" size={18} />
    ):(
        <CircleDashed color="#000000" size={18} />
    );
}