

const Tag = ({ text }) => {
  return (
    <>
    [<strong>{text.split(' ').join('-')}</strong>]
    </>
  )
}

export default Tag