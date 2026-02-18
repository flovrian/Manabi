import {ChangeEvent, useEffect, useState} from "react";
import ArrivalScreen from "../components/hud/arrival/ArrivalScreen";

import '../styles/notes_page.css'

import notesIcon from '../../public/images/dock/noteIcon.png'

/* WIP - Most likely forever since I was never able to get a solid design idea. */

export default function NotesPage() {

    const [showArrivalScreen, setShowArrivalScreen] = useState(true);
    const [noteContent, setNoteContent] = useState({title: '', content: ''});

    function handleNoteChange(data: ChangeEvent<HTMLTextAreaElement>, type : string) : void {
        setNoteContent(prev => ({...prev, [type]: data.target.value,}));
    }

    useEffect(() => {
        const arrivalScreen = setTimeout(() => {
            setShowArrivalScreen(false);
        }, 5000);

        return () => {clearTimeout(arrivalScreen)}
    }, []);

    return (
        <>
            {showArrivalScreen && (
                <ArrivalScreen
                    siteTitle={'arrival.title.notes'}
                    imagePath={notesIcon}
                    iconName={"notes"}
                />
            )}

            <div className={'notes-page'}>
                <div className="container">
                <textarea
                    className={'notes-text-area'}
                    name={'note-content'}
                    onChange={(e) => handleNoteChange(e, 'content')}
                />
                    <div className="notes-note-selector-wrapper">

                    </div>
                </div>
            </div>
        </>
    );
}