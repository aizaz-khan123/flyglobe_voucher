import React from 'react'

import Link from 'next/link';

import { Button } from '@mui/material';

import { AiOutlineExclamationCircle } from "react-icons/ai";

const SearchResultExpireModal = ({ searchApiPayload, handleCloseSearchResultExpireModal, setTime }) => {
    const searchAgaiHandler = () => {
        setTime(10 * 60);
        searchApiPayload();
        handleCloseSearchResultExpireModal();
    }

    
return (
        <div>
            <div className='flex justify-center items-center mt-5'>
                <AiOutlineExclamationCircle className='text-5xl text-red-600 mb-5' />
            </div>

            <h1 className='text-3xl font-bold text-center mb-5'>Search Result Expired</h1>
            <p className='text-base text-gray-700 font-normal mb-5'>
                To ensure you have access to the most up-to-date flight information, please start a new search.
            </p>
            <div className='flex justify-end'>
                {/* <Link href='/flights'> */}
                <Button className='rounded-full' onClick={searchAgaiHandler}>Search Again</Button>
                {/* </Link> */}
            </div>
        </div>
    )
}

export default SearchResultExpireModal
