program parser
    use tokenizer
    implicit none

    character(len=*), parameter :: input = "Hola" !Aqui se debe colocar la entrada, en la variable input
    character(len=:), allocatable :: lexeme
    integer :: cursor
    
    cursor = 1
    lexeme = ""  ! Inicializar lexeme para evitar problemas en la condición del bucle

    do while (lexeme /= "EOF" .and. lexeme /= "ERROR")
        lexeme = nextSym(input, cursor)
        print *, lexeme
    end do
end program parser