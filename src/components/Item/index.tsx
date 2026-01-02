import {View, Text, TouchableOpacity} from "react-native";
import { Trash2 } from "lucide-react-native";   

import { styles } from "./styles";
import {StatusIcon} from "../StatusIcon";
import { FilterStatus } from "@/types/FilterStatus";

type itemData = {
    status: FilterStatus;
    description: string;
}

type  Props = {
    data: itemData;
    onStaus: () => void;
    onRemove: () => void;
}


export function Item({data, onStaus, onRemove}: Props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.8} onPress={onStaus}>
                <StatusIcon status={data.status} />
            </TouchableOpacity>
            <Text style={styles.description}>
                {data.description}
            </Text>
            <TouchableOpacity onPress={onRemove}>
                <Trash2 color="#828282" size={18} />
            </TouchableOpacity>
        </View>
    );
}