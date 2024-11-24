import { IDL, query, update } from 'azle'
import { nat32, StableBTreeMap } from 'azle/experimental'

type Superhero = {
    name: string,
    superpowers: string[]
}

type SuperheroID = nat32;

export default class {
    next: SuperheroID = 0;

    //initialize a stable structure
    superheroes = StableBTreeMap<SuperheroID, Superhero>(0)

    //create
    @update([IDL.Text], IDL.Text)
    create(superhero: string): string {
        //parse string to json
        const superheroObject= JSON.parse(superhero);

        let superheroID = this.next;

        this.next += 1;

        this.superheroes.insert(superheroID, superheroObject);

        return String(superheroID);

    }

    //get superhero by id
    @query([IDL.Nat32], IDL.Text)
    getById(superheroID: SuperheroID): string {
        const superhero = this.superheroes.get(superheroID);
        return superhero == null ? "Not Found" : JSON.stringify(superhero);
    }

    //update
    @update([IDL.Nat32, IDL.Text], IDL.Bool)
    update(superheroID: SuperheroID, superhero: Superhero): boolean {
        //check if user exist
        if (this.superheroes.containsKey(superheroID)) {
            this.superheroes.insert(superheroID, superhero);
            return true
        } else {
            return false
        }
    }
    //delete
    @update([IDL.Nat32], IDL.Bool)
    delete(superheroID: SuperheroID): boolean {
        if (this.superheroes.containsKey(superheroID)) {
            this.superheroes.remove(superheroID);
            return true
        } else {
            return false
        }
    }
    //get all superheroes
    @query([], IDL.Text)
    getAll(): string{
         return JSON.stringify(this.superheroes.items());
    }
}