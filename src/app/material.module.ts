import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports:[
        MatExpansionModule,
        MatButtonModule,
    ],
    exports:[
        MatExpansionModule,
        MatButtonModule,
    ]
})

export class MaterialModule{}