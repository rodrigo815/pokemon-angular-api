import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { IAttack } from 'pokemon-tcg-sdk-typescript/dist/interfaces/attack';
import { MatTableDataSource } from '@angular/material/table';
import { IResistance, IWeakness } from 'pokemon-tcg-sdk-typescript/dist/sdk';

/**
 * Páginas de detalhes da carta de Pokemon:
 * 
 * 1. Imagem em alta definição
 * 2. Nome
 * 3. ID do Pokemon
 * 4. Tipo(s)
 * 5. Lista de ataques com:
 *   5.1 Custo de “mana”
 *   5.2 Nome
 *   5.3 Dano
 *   5.4 Descrição
 * 6. Resistencia(s)
 * 7. Fraqueza(s)
 *
 * @author Rodrigo Sieja Bertin
 */
@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.component.html',
  styleUrls: ['./detalhe.component.sass']
})
export class DetalheComponent implements OnInit {

  dataSourceAtaques = new MatTableDataSource<any>();
  dataSourceResistencias = new MatTableDataSource<any>();
  dataSourceFraquezas = new MatTableDataSource<any>();

  displayedColumnsAtaques: string[] = ['custo', 'nome', 'dano', 'descricao'];
  displayedColumnsResistencias: string[] = ['resistenciaTipo', 'resistenciaValor'];
  displayedColumnsFraquezas: string[] = ['fraquezaTipo', 'fraquezaValor'];

  cardId: string;
  carregando: boolean = true;
  carta: PokemonTCG.Card;

  mobileColumns: number = 1;
  desktopColumns: number = 4;

  constructor(private readonly route: ActivatedRoute) {
    this.cardId = this.route.snapshot.paramMap.get('cardId');
  }

  ngOnInit(): void {
    if (this.cardId != null) {
      this.findById(this.cardId);
    }
  }

  public findById(cardId: string): void {
    PokemonTCG.Card.find(cardId)
    .then(card => {
      this.carta = card;

      this.carregando = false;

      this.dataSourceAtaques.data = this.carta.attacks as IAttack[];
      this.dataSourceResistencias.data = this.carta.resistances as IResistance[];
      this.dataSourceFraquezas.data = this.carta.weaknesses as IWeakness[];
    })
    .catch(error => {
      console.log(error);
      this.carregando = false;
    });
  }

}
