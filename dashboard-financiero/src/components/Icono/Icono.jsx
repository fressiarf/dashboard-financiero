const Icono = ({ nombre, tamaño = 20, clase = '', ...props }) => {
  return (
    <svg
      width={tamaño}
      height={tamaño}
      className={`icono ${clase}`.trim()}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <use href={`/iconos.svg#icono-${nombre}`} />
    </svg>
  )
}

export default Icono
