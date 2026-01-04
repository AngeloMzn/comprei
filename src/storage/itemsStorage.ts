import AsyncStorage from "@react-native-async-storage/async-storage";
import {FilterStatus} from "@/types/FilterStatus";

const ITEMS_STORAGE_KEY = '@comprei:items';

export type ItemStorage = {
    id: string;
    description: string;
    status: FilterStatus;
}

async function get(): Promise<ItemStorage[]> {
    try {
        const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
        return storage ? JSON.parse(storage) : [];
    } catch (e) {
        throw new Error('GET_ITEMS: ' + e);
    }
}

async function getByStatus(status: FilterStatus): Promise<ItemStorage[]> {
    try {
        const items = await get();
        return items.filter(item => item.status === status);
    } catch (e) {
        throw new Error('GET_ITEMS_BY_STATUS: ' + e);
    }
}

async function save(items: ItemStorage[]): Promise<void> {
    try {
        await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
        throw new Error('SAVE_ITEMS: ' + e);
    }
}

async function add(newItem: ItemStorage): Promise<ItemStorage[]> {
    try {
        const items = await get();
        const updatedItems = [...items, newItem];
        await save(updatedItems);
        return updatedItems;
    } catch (e) {
        throw new Error('ADD_ITEM: ' + e);
    }
}

async function remove(id: string): Promise<void> {
    try {
        const items = await get();
        const filteredItems = items.filter(item => item.id !== id);
        await save(filteredItems);
    } catch (e) {
        throw new Error('REMOVE_ITEM: ' + e);
    }
}

async function clear(): Promise<void> {
    try {
        await AsyncStorage.removeItem(ITEMS_STORAGE_KEY);
    } catch (e) {
        throw new Error('CLEAR_ITEMS: ' + e);
    }
}

async function toggleStatus(id: string): Promise<void> {
    const items = await get();
    const updatedItems = items.map(item => {
        if (item.id === id) {
            return {
                ...item, 
                status: item.status === FilterStatus.PENDING ? FilterStatus.DONE : FilterStatus.PENDING
            };
        }
        return item;
    });
    await save(updatedItems);
}

export const itemsStorage = {
    get,
    getByStatus,
    add,
    remove,
    clear,
    toggleStatus
}