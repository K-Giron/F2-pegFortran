import Tokenizer from "./Tokenizer.js";

export async function generateTokenizer(grammar) {
  const tokenizer = new Tokenizer();
  return `
module tokenizer
implicit none

contains

subroutine parse(input)
        character(len=:), intent(inout), allocatable :: input
        integer :: cursor = 1
        character(len=:), allocatable :: lexeme
	print *, "Tipo "//"Lexema"
        do while (len(input) > 0)
            lexeme = nextSym(input, cursor)
            if (lexeme == "EOF") exit
            print *, lexeme
        end do
    end subroutine parse

function upcase(s) result(upper)
    character(len=*), intent(in) :: s
    character(len=len(s)) :: upper
    integer :: i

    ! Convertir la cadena a mayúsculas
    do i = 1, len(s)
        upper(i:i) = char(iachar(s(i:i)) - iachar('a') + iachar('A'))  ! Convertir a mayúscula
        if (iachar(s(i:i)) < iachar('a') .or. iachar(s(i:i)) > iachar('z')) then
            upper(i:i) = s(i:i)  ! Si no es una letra minúscula, dejarla igual
        end if
    end do
end function upcase

function nextSym(input, cursor) result(lexeme)
    character(len=*), intent(in) :: input
    integer, intent(inout) :: cursor
    character(len=:), allocatable :: lexeme  ! Se usa para longitud variable

    integer :: i

    ! Verificar si el cursor está fuera del rango
    if (cursor > len(input)) then
        lexeme = "EOF"  ! Devolver "EOF" si se llega al final de la cadena
        print*, lexeme
        return
    end if

    
    ${grammar.map((produccion) => produccion.accept(tokenizer)).join("\n")}

    print *, "error lexico en col ", cursor, ', "'//input(cursor:cursor)//'"'
    lexeme = "ERROR"
    cursor = cursor + 1  ! Incrementar el cursor para evitar bucle infinito

end function nextSym
end module tokenizer 
    `;
}

export function generateCaracteres(chars) {
    console.log("Inicio",chars.map((char) => `"${char}"`),"Fin")
  if (chars.length === 0) return "";
  return `
    if (findloc([${chars
      .map((char) => `"${char}"`)
      .join(", ")}], input(i:i), 1) > 0) then
        lexeme = input(cursor:i)
        cursor = i + 1
        return
    end if
    `;
}

/* ${grammar
    //   .map((produccion) => produccion.accept(this))
    //   .flat()
    //   .filter((result) => result !== undefined)
    //   .join("\n")}
    */
