import DockIcon from "../DockIcon";
import { useNavigate } from "react-router-dom";
import noteImg from "/images/dock/noteIcon.png";
import {useState} from "react";

export function NoteIcon() {

    const navigate = useNavigate();
    const [noteAmount, setNoteAmount] = useState(37);


    /* Grab this all via an API later on -> e.g. /api/notes*/

    function addNote() {
        setNoteAmount(noteAmount + 1);
    }

    return (
        <DockIcon
            imagePath={noteImg}
            iconName='Notes'
            iconType={'notes'}
            badgeContent={noteAmount}
            onClick={() => addNote()}
        />
    );
}