import React from 'react'

const linkClass =
  "w-full cursor-pointer hover:scale-95 hover:text-red-400 transition-all mb-4 duration-300 ease-in-out text-base font-semibold flex items-center"

const MenuLink = ({ icon, label, onClick, href }) => {
  const content = (
    <>
      <span className="mr-3 text-lg">{icon}</span>
      <span>{label}</span>
    </>
  )

  if (href) {
    // Real anchor tag for external destinations — router.push is for
    // in-app navigation and doesn't correctly leave the site.
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={linkClass}>
      {content}
    </button>
  )
}

export default MenuLink