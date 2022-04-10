let form = document.querySelector('.validator') as HTMLFormElement;
let search = document.querySelector('.search') as HTMLLinkElement;
let searchInput = document.querySelector('#search') as HTMLInputElement;

// Functions
let validator = {
    handleSubmit:(event: Event):void => {
        event.preventDefault();

        let send: boolean = true;

        validator.clearError();

        let inputs = document.querySelectorAll('input');

        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            let check = validator.checkInput(input);

            if(check !== true) {
                send = false;
                validator.showError(input, check);
            }
        }

        if(send) {
            form.submit();
        }
    },
    checkInput: (input: HTMLInputElement): boolean | string => {
        let rules: any = input.getAttribute('data-rules');
        
        if(rules !== null) {
            rules = rules.split('|');
            for(let k in rules) {
                let rDetails = rules[k].split('=');

                switch(rDetails[0]) {
                    case 'required':
                        if(input.value == '') {
                            return 'Campo não pode ser vazio'
                        }
                    break;
                    case 'email':
                        if (input.value != '') {
                            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if (!regex.test(input.value.toLowerCase())) {
                                return `E-mail inválido!`;
                        }
                    }
                    break;
                    case 'cpf':
                        var soma: number = 0;
                        var resto: number;
                        var inputCPF: string = input.value;
                        var i: number = 0;

                        if(inputCPF == '00000000000') return 'CPF Invávlido';
                        for(i=1; i<=9; i++) soma = soma + parseInt(inputCPF.substring(i-1, i)) * (11 - i);
                        resto = (soma * 10) % 11;

                        if((resto == 10) || (resto == 11)) resto = 0;
                        if(resto != parseInt(inputCPF.substring(9, 10))) return 'CPF Invávlido';

                        soma = 0;
                        for(i = 1; i <= 10; i++) soma = soma + parseInt(inputCPF.substring(i-1, i))*(12-i);
                        resto = (soma * 10) % 11;

                        if((resto == 10) || (resto == 11)) resto = 0;
                        if(resto != parseInt(inputCPF.substring(10, 11))) return 'CPF Invávlido';
                    break;
                    case 'tel':
                        if (input.value != '') {
                            let regex = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
                            if (!regex.test(input.value.toLowerCase())) {
                                return `Número de telefone inválido!`;
                        }
                    }
                    break;
                    case 'cep':
                        let cep: string = input.value.replace('-', '');
                        let url = `https://viacep.com.br/ws/${cep}/json/`
                        let inputBairro = document.querySelector('#bairro') as HTMLInputElement;
                        let inputCidade = document.querySelector('#cidade') as HTMLInputElement;
                        let inputEstado = document.querySelector('#estado') as HTMLInputElement;
                        let inputEndereco = document.querySelector('#endereco') as HTMLInputElement;

                        console.log(cep)

                        fetch(url, {mode:"cors"}).then(response =>  response.json()
                            .then(data => {
                                inputBairro.value = data.bairro;
                                inputCidade.value = data.localidade;
                                inputEstado.value = data.uf;
                                inputEndereco.value = data.logradouro;
                            }))
                        .catch(() => 'CEP não encontrado');
                    break;
                }
            }
        }

        return true
    },
    showError: (input: HTMLInputElement, error: string | boolean):void => {
        input.style.borderColor = 'red';

        let errorElement = document.createElement('div');
        errorElement.classList.add('error');
        errorElement.innerHTML = `${error}`;

        input.parentElement?.insertBefore(errorElement, input.nextElementSibling)
    },
    clearError: ():void => {
        let errorElements = document.querySelectorAll('.error');
        let inputs = document.querySelectorAll('input');

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.borderColor = '';
        }

        for (let i = 0; i < errorElements.length; i++) {
            errorElements[i].remove();
        }
    }
}

let maxLenght = (input: HTMLInputElement):void => {
    if (input.value.length > input.maxLength) {
        input.value = input.value.slice(0, input.maxLength);
    }
}

// Events
form.addEventListener('submit', validator.handleSubmit);
search.addEventListener('click', () => {
    validator.clearError();
    validator.checkInput(searchInput)
});