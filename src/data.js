// Базовый URL для API
const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

// Кеши для данных
let sellersCache = null;
let customersCache = null;
let lastResult = null;
let lastQuery = null;

export function initData() {
    // Функция для приведения строк в тот вид, который нужен нашей таблице
    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellersCache ? sellersCache[item.seller_id] : `Seller ${item.seller_id}`,
        customer: customersCache ? customersCache[item.customer_id] : `Customer ${item.customer_id}`,
        total: item.total_amount
    }));

    // Функция получения индексов
    const getIndexes = async () => {
        if (!sellersCache || !customersCache) {
            // Сервер уже возвращает готовый объект { id: { id, first_name, last_name }, ... }
            // Просто сохраняем его как есть
            [sellersCache, customersCache] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                fetch(`${BASE_URL}/customers`).then(res => res.json()),
            ]);
        }

        return { 
            sellers: sellersCache, 
            customers: customersCache 
        };
    };

    // Функция получения записей о продажах с сервера
    const getRecords = async (query = {}, isUpdated = false) => {
        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();

        if (lastQuery === nextQuery && !isUpdated) {
            return lastResult;
        }

        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        lastQuery = nextQuery;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords
    };
}