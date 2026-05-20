function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'))
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'))

    document.getElementById(id).classList.add('active')
    event.target.classList.add('active')

    carregarVeiculos()
    carregarEstadias()
}


function showMsg(elId, texto, tipo) {
    const el = document.getElementById(elId)
    el.innerHTML = `<div class="msg msg-${tipo}">${texto}</div>`
    setTimeout(() => el.innerHTML = '', 3000)
}

function formatData(d) {
    if (!d) return '—'
    return new Date(d).toLocaleString('pt-BR')
}

function getVeiculos() {
    return JSON.parse(localStorage.getItem('veiculos')) || []
}

function setVeiculos(lista) {
    localStorage.setItem('veiculos', JSON.stringify(lista))
}

function getEstadias() {
    return JSON.parse(localStorage.getItem('estadias')) || []
}

function setEstadias(lista) {
    localStorage.setItem('estadias', JSON.stringify(lista))
}

function carregarVeiculos() {
    const veiculos = getVeiculos()
    const tbody = document.getElementById('tabela-veiculos')
    const select = document.getElementById('e-veiculoId')

    tbody.innerHTML = ''
    select.innerHTML = ''

    if (!veiculos.length) {
        tbody.innerHTML = `<tr><td colspan="7">Nenhum veículo cadastrado</td></tr>`
        return
    }

    veiculos.forEach(v => {
        tbody.innerHTML += `
        <tr>
          <td>${v.placa}</td>
          <td><strong>${v.placa}</strong></td>
          <td>${v.modelo}</td>
          <td>${v.cor || '-'}</td>
          <td>${v.ano || '-'}</td>
          <td>${getEstadias().filter(e => e.placa === v.placa).length}</td>
          <td class="actions">
            <button class="btn btn-danger" onclick="deletarVeiculo('${v.placa}')">Excluir</button>
          </td>
        </tr>
        `

        select.innerHTML += `<option value="${v.placa}">${v.placa} - ${v.modelo}</option>`
    })
}

function cancelarVeiculo() {
    document.getElementById('v-placa').value = ''
    document.getElementById('v-modelo').value = ''
    document.getElementById('v-cor').value = ''
    document.getElementById('v-ano').value = ''
}

function salvarVeiculo() {
    const placa = document.getElementById('v-placa').value
    const modelo = document.getElementById('v-modelo').value
    const cor = document.getElementById('v-cor').value
    const ano = document.getElementById('v-ano').value

    if (!placa || !modelo) {
        return showMsg('msg-veiculo', 'Placa e modelo são obrigatórios!', 'error')
    }

    const lista = getVeiculos()

    if (lista.find(v => v.placa === placa)) {
        return showMsg('msg-veiculo', 'Placa já cadastrada!', 'error')
    }

    lista.push({ placa, modelo, cor, ano })
    setVeiculos(lista)

    showMsg('msg-veiculo', 'Veículo cadastrado!', 'success')
    cancelarVeiculo()
    carregarVeiculos()
}

function deletarVeiculo(placa) {
    if (!confirm('Deseja excluir?')) return

    let lista = getVeiculos()
    lista = lista.filter(v => v.placa !== placa)
    setVeiculos(lista)

    let estadias = getEstadias()
    estadias = estadias.filter(e => e.placa !== placa)
    setEstadias(estadias)

    showMsg('msg-veiculo', 'Excluído!', 'success')
    carregarVeiculos()
    carregarEstadias()
}

// ---------------- ESTADIAS ----------------
function carregarEstadias() {
    const estadias = getEstadias()
    const tbody = document.getElementById('tabela-estadias')

    tbody.innerHTML = ''

    if (!estadias.length) {
        tbody.innerHTML = `<tr><td colspan="8">Nenhuma estadia</td></tr>`
        return
    }

    estadias.forEach(e => {
        const veiculo = getVeiculos().find(v => v.placa === e.placa)

        tbody.innerHTML += `
        <tr>
          <td>${e.id}</td>
          <td>${veiculo ? veiculo.placa + ' - ' + veiculo.modelo : e.placa}</td>
          <td>${formatData(e.entrada)}</td>
          <td>${formatData(e.saida)}</td>
          <td>R$ ${e.valorHora}</td>
          <td>${e.valorTotal ? 'R$ ' + e.valorTotal.toFixed(2) : '—'}</td>
          <td>
            ${e.saida
                ? '<span class="badge badge-green">Saiu</span>'
                : '<span class="badge badge-yellow">No pátio</span>'}
          </td>
          <td class="actions">
            ${!e.saida ? `<button class="btn btn-success" onclick="finalizarEstadia(${e.id})">Finalizar</button>` : ''}
            <button class="btn btn-danger" onclick="deletarEstadia(${e.id})">Excluir</button>
          </td>
        </tr>
        `
    })
}

function cancelarEstadia() {
    document.getElementById('e-valorHora').value = ''
}

function salvarEstadia() {
    const placa = document.getElementById('e-veiculoId').value
    const valorHora = parseFloat(document.getElementById('e-valorHora').value)

    if (!placa || !valorHora) {
        return showMsg('msg-estadia', 'Preencha os campos!', 'error')
    }

    const lista = getEstadias()

    lista.push({
        id: Date.now(),
        placa,
        valorHora,
        entrada: new Date(),
        saida: null,
        valorTotal: null
    })

    setEstadias(lista)

    showMsg('msg-estadia', 'Estadia iniciada!', 'success')
    cancelarEstadia()
    carregarEstadias()
}

function finalizarEstadia(id) {
    const lista = getEstadias()
    const est = lista.find(e => e.id === id)

    if (!est) return

    est.saida = new Date()

    const horas = (new Date(est.saida) - new Date(est.entrada)) / (1000 * 60 * 60)
    est.valorTotal = horas * est.valorHora

    setEstadias(lista)
    carregarEstadias()
}

function deletarEstadia(id) {
    if (!confirm('Deseja excluir?')) return

    let lista = getEstadias()
    lista = lista.filter(e => e.id !== id)

    setEstadias(lista)

    showMsg('msg-estadia', 'Excluído!', 'success')
    carregarEstadias()
}

carregarVeiculos()
carregarEstadias()