

const Tag = ({ text }) => {
  return (
    <div className="py-1 px-3 uppercase shadow-sm no-underline rounded-full bg-gray text-red text-xs mr-2">
    {text.split(' ').join('-')}
    </div>
  )
}

export default Tag
