const Icono = ({ nombre, tamaño = 20, clase = '' }) => {
  return (
    <svg
      width={tamaño}
      height={tamaño}
      className={`icono ${clase}`.trim()}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <use href={`/iconos.svg#icono-${nombre}`} />
    </svg>
  )
}

export default Icono
