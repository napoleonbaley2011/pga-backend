import { TableNotesRequest } from "./TableNotesRequest"
import { useCallback, useState } from "react"
import { NoteRequestModel } from "../../../models/NoteRequestModel";
import { ViewNoteRequest } from "./ViewNoteRequest";

export const NoteRequestView = () => {

    const [openDialog, setopenDialog] = useState(false);
    const [itemView, setItemView] = useState<NoteRequestModel | null>(null)

    const handleDialog = useCallback((value: boolean) => {
        if (!value) setItemView(null)
        setopenDialog(value);
    }, [])

    return (
        <>
            <TableNotesRequest
                itemView={(v) => {
                    setItemView(v)
                    handleDialog(true)
                }}
            />
            {
                openDialog &&
                <ViewNoteRequest
                    open={openDialog}
                    handleClose={() => handleDialog(false)}
                    item={itemView}
                />
            }
        </>
    )
}