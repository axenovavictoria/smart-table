export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        // @todo: #4.1 — заполнить выпадающие списки опциями
        Object.keys(indexes).forEach((elementName) => {
            // Очищаем select перед добавлением новых опций
            const select = elements[elementName];
            select.innerHTML = '';
            
            // Добавляем опцию по умолчанию
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '—';
            select.appendChild(defaultOption);

            // Добавляем опции из индексов
            Object.values(indexes[elementName]).forEach(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                select.appendChild(el);
            });
        });
    };

    const applyFiltering = (query, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input, select');
            if (input) {
                input.value = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element && ['INPUT', 'SELECT'].includes(element.tagName)) {
                const value = element.value;
                if (value && value.trim() !== '') {
                    filter[`filter[${element.name}]`] = value.trim();
                }
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}