const GroupStatusWidget = ({ status }) => {
    if (status == 'publish') {
        return (
            <div className='inline rounded-badge border px-3 py-1 text-xs font-medium text-success'>
                Publish
            </div>
        )
    } else if (status == 'not-publish') {
        return (
            <div className='inline rounded-badge border px-3 py-1 text-xs font-medium text-red-500'>
                Not Publish
            </div>
        )
    } else if (status == 'pending') {
        return (
            <div className='inline rounded-badge border px-3 py-1 text-xs font-medium text-primary'>
                Pending
            </div>
        )
    }
}

export default GroupStatusWidget
