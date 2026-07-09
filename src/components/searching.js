export function initSearching(searchField) {
    return (query, state, action) => {
        // @todo: #5.2 — применить компаратор
        const searchValue = state[searchField];
        if (searchValue && searchValue.trim() !== '') {
            return Object.assign({}, query, {
                search: searchValue.trim()
            });
        }
        return query;
    };
}