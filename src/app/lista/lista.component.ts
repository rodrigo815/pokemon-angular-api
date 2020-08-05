import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { MatPaginator } from '@angular/material/paginator';

/**
 * 
 * 
 * Página com lista somente das cartas Pokemon:
 * 
 * 1. Imagem da carta
 * 2. Nome do Pokemon
 * 3. ID do Pokemon
 * 4. Tipo(s)
 *
 * @author Rodrigo Sieja Bertin
 */
@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.sass']
})
export class ListaComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['imagem', 'nome', 'id', 'tipos', 'detalhe'];

  cartas: PokemonTCG.Card[];
  carregando: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.findAll();
  }

  public findAll(): void {
    PokemonTCG.Card.all()
    .then(cards => {
      this.cartas = cards.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }

        if (a.name < b.name) {
          return -1;
        }

        return 0;
      });

      this.carregando = false;

      this.dataSource.data = this.cartas as PokemonTCG.Card[];
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.name.toLowerCase().includes(filter);
      };
    })
    .catch(error => {
      this.carregando = false;
      console.log(error);
    });
  }

  public aplicarFiltro(cardName: string) {
    this.dataSource.filter = cardName.toLowerCase();
  }

}
