import {List, ListItem, ListItemButton} from "@mui/material";
import React from "react";
import {SearchHistoryEntry} from "../types";

interface ISearchHistoryListProps {
    searchHistory: SearchHistoryEntry[]
    setSelectedHistoryEntry: (historyEntry: SearchHistoryEntry) => void
}

export const SearchHistoryList = ({searchHistory, setSelectedHistoryEntry}: ISearchHistoryListProps) => {
    
    return (
        <List>
            {searchHistory.map((historyEntry, index) => {
                return (
                    <ListItem key={historyEntry.id} disablePadding className="cursor-pointer">
                        <ListItemButton onClick={() => setSelectedHistoryEntry(historyEntry)} >
                            <p className="text-sm" key={`${historyEntry}-${index}`}>{historyEntry.label}</p>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
}