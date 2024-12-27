program test_tokenizer
    use tokenizer
    implicit none

    character(len=:), allocatable :: input_string

    ! Asignar una cadena de entrada para probar
    input_string = "hola"

    ! Llamar a la subrutina parse para procesar la cadena
    call parse(input_string)

end program test_tokenizer