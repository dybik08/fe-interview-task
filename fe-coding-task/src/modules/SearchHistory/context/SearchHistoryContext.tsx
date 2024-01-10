import {createContext, PropsWithChildren, useContext, useState} from "react";
import {SearchHistoryEntryId, SearchHistoryEntry} from "../types";

interface ISearchHistoryContext {
    searchHistory: SearchHistoryEntry[]
    updateHistoryEntry: (id: SearchHistoryEntryId, updatedEntry: SearchHistoryEntry) => void
    addEntryToHistoryEntries: (newEntry: SearchHistoryEntry) => void
}

const SearchHistoryContext = createContext<Partial<ISearchHistoryContext>>({})

export const SearchHistoryProvider = ({children}: PropsWithChildren<{}>) => {
    const initialHistoryEntries = localStorage.getItem(`historyEntriesV2`)

    const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>(initialHistoryEntries ? JSON.parse(initialHistoryEntries) : [])

    const updateHistoryEntry = (id: SearchHistoryEntryId, updatedEntry: SearchHistoryEntry) => {
        setSearchHistory(prevState => {
            const updatedEntries = prevState.map(entry => {
                if(entry.id === id) {
                    return updatedEntry
                }

                return entry
            })

            localStorage.setItem(`historyEntriesV2`, JSON.stringify(updatedEntries))

            return updatedEntries
        })
    }
    
    const addEntryToHistoryEntries = (newEntry: SearchHistoryEntry) => {
        setSearchHistory(prevState => {
            const updatedEntries = [...prevState, newEntry]

            localStorage.setItem(`historyEntriesV2`, JSON.stringify(updatedEntries))

            return updatedEntries
        })
    }
    
    const ctx: ISearchHistoryContext = {
        addEntryToHistoryEntries,
        searchHistory,
        updateHistoryEntry
    }
    
    return (
        <SearchHistoryContext.Provider value={ctx}>
            {children}
        </SearchHistoryContext.Provider>
    )
}

export const useSearchHistory = (): ISearchHistoryContext => {
    const {searchHistory, updateHistoryEntry, addEntryToHistoryEntries} = useContext(SearchHistoryContext)

    if(!searchHistory) throw new Error("ISearchHistoryContext.searchHistory is not defined")
    if(!updateHistoryEntry) throw new Error("ISearchHistoryContext.updateHistoryEntry is not defined")
    if(!addEntryToHistoryEntries) throw new Error("ISearchHistoryContext.addEntryToHistoryEntries is not defined")


    return {
        searchHistory, 
        updateHistoryEntry, 
        addEntryToHistoryEntries
    }
}