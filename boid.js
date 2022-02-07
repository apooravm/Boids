class Boid 
{
    constructor()
    {
        // this.position = createVector(width/2, height/2);
        this.position = createVector(random(0, width), random(0, height));
        this.velocity = p5.Vector.random2D();
        // this.velocity.setMag(random(2, 4)); //set the magnitude
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 100;
        this.perception = random(20, 100);
        // this.greenLineMode = false;
        // this.R = random(255);
        // this.G = random(255);
        // this.B = random(255);
    }

    wrapEdges()
    {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;        
        }
    }

    update()
    {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
    }

    align(boids, p)
    {
        let perceptionRadius = p;
        let steering = createVector();
        let totalLocalBoids = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius)
            {
                steering.add(other.velocity);
                totalLocalBoids++;
            }
            if (greenLineMode) {
                this.joinLine(other);
            }
        }
        if (totalLocalBoids > 0) {
            steering.div(totalLocalBoids);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce); //limit the magnitude
        }
        return steering;
    }

    alignCLEANER(other, steeringAlign, totalLocalBoidsAlign)
    {
        // let perceptionRadius = this.perception;
        // let steeringAlign = createVector();
        // let totalLocalBoidsAlign = 0; //local var for flock func
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < this.perception)
            {
                steeringAlign.add(other.velocity);
                totalLocalBoidsAlign++;
            }
            this.joinLine(other);
        // return totalLocalBoidsAlign, steeringAlign;
    }

    checkAlign(totalLocalBoidsAlign, steeringAlign)
    {
        if (totalLocalBoidsAlign > 0) {
            steeringAlign.div(totalLocalBoidsAlign);
            steeringAlign.setMag(this.maxSpeed);
            steeringAlign.sub(this.velocity);
            steeringAlign.limit(this.maxForce); //limit the magnitude
        }
        return steeringAlign;
    }

    cohesion(boids, p)
    {
        let perceptionRadius = p;
        let steering = createVector();
        let totalLocalBoids = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius)
            {
                steering.add(other.position);
                totalLocalBoids++;
            }
        }
        if (totalLocalBoids > 0) {
            steering.div(totalLocalBoids);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce); //limit the magnitude        
        }
        return steering;
    }

    cohesionCLEANER(other, steeringCohesion, totalLocalBoidsCohesion)
    {
        // let perceptionRadius = this.perception;
        // let steeringCohesion = createVector();
        // let totalLocalBoidsCohesion = 0; //global var for flock func

        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (other != this && d < this.perception)
        {
            steeringCohesion.add(other.position);
            totalLocalBoidsCohesion++;
        }
        // return totalLocalBoidsCohesion, steeringCohesion;
    }

    checkCohesion(totalLocalBoidsCohesion, steeringCohesion)
    {
        if (totalLocalBoidsCohesion > 0) {
            steeringCohesion.div(totalLocalBoidsCohesion);
            steeringCohesion.sub(this.position);
            steeringCohesion.setMag(this.maxSpeed);
            steeringCohesion.sub(this.velocity);
            steeringCohesion.limit(this.maxForce); //limit the magnitude        
        }
        return steeringCohesion;
    }



    separation(boids, p)
    {
        let perceptionRadius = p;
        let steering = createVector();
        let totalLocalBoids = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius)
            {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d*d); //thus farther the boid lesser the magnitude/force applied on this boid
                steering.add(diff);
                totalLocalBoids++;
            }
        }
        if (totalLocalBoids > 0) {
            steering.div(totalLocalBoids);
            // steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce); //limit the magnitude        
        }
        return steering;
    }

    separationCLEANER(other, steeringSeparation, totalLocalBoidsSeparation)
    {
        // let perceptionRadius = this.perception;
        // let steeringSeparation = createVector();
        // let totalLocalBoidsSeparation = 0;
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if (other != this && d < this.perception)
        {
            let diff = p5.Vector.sub(this.position, other.position);
            diff.div(d*d); //thus farther the boid lesser the magnitude/force applied on this boid
            steeringSeparation.add(diff);
            totalLocalBoidsSeparation++;
        }
        // return totalLocalBoidsSeparation, steeringSeparation;
    }

    checkSeparation(totalLocalBoidsSeparation, steeringSeparation)
    {
        if (totalLocalBoidsSeparation > 0) {
            steeringSeparation.div(totalLocalBoidsSeparation);
            // steering.sub(this.position);
            steeringSeparation.setMag(this.maxSpeed);
            steeringSeparation.sub(this.velocity);
            steeringSeparation.limit(this.maxForce); //limit the magnitude        
        }
        return steeringSeparation;
    }

    flock(boids)
    {
        // this.CleanerFlock(boids);
        this.originalFlock(boids);

    }

    joinLine(other)
    {
        let p = this.perception*2;
        let trueX = false;
        let trueY = false;

        let diffX = other.position.x - this.position.x;
        let diffY = other.position.y - this.position.y;
        if (diffX < 0) {
            diffX *= -1;
        }
        if (diffY < 0) {
            diffY *= -1;
        }
        if (diffX < p ) {
            trueX = true;
        }
        if (diffY < p ) {
            trueY = true;
        }
        if (other != this && (trueX && trueY))
        {
            stroke(cols[colIndex]);
            strokeWeight(0.2);
            line(this.position.x, this.position.y, other.position.x, other.position.y);
        }
    }


    show()
    {
        // strokeWeight(2);
        // noFill();
        stroke(255);
        strokeWeight(5);
        fill(255, 0);
        point(this.position.x, this.position.y);
    }

    originalFlock(boids)
    {
        this.acceleration.set(0, 0); //set acc to 0, so that the force doesnt accumulate
        let alignment = this.align(boids, this.perception);
        let cohesion = this.cohesion(boids, this.perception);
        let separation = this.separation(boids, this.perception);

        separation.mult(separationSlider.value());
        cohesion.mult(cohesionSlider.value());
        alignment.mult(alignSlider.value());

        // this.perception *= (perceptionSlider.value());
        // this.perception = perceptionSlider.value();

        this.maxSpeed = speedSlider.value();

        this.acceleration.add(cohesion);
        this.acceleration.add(alignment);
        this.acceleration.add(separation);
    }

    CleanerFlock(boids)
    {
        //Mine
        this.acceleration.set(0, 0); //set acc to 0, so that the force doesnt accumulate

        // Alignment vars
        let perceptionRadius = this.perception;
        let steeringAlign = createVector();
        let totalLocalBoidsAlign = 0;

        // Cohesion Vars
        let steeringCohesion = createVector();
        let totalLocalBoidsCohesion = 0; //global var for flock func

        // Separation Vars
        let steeringSeparation = createVector();
        let totalLocalBoidsSeparation = 0;
        // let d = dist(this.position.x, this.position.y, other.position.x, other.position.y); //*

        let alignFinal = 0;
        let cohesionFinal = 0;
        let separationFinal = 0

        for (let other of boids) {
            this.alignCLEANER(other, steeringAlign, totalLocalBoidsAlign);
            this.cohesionCLEANER(other, steeringCohesion, totalLocalBoidsCohesion);
            this.separationCLEANER(other, steeringSeparation, totalLocalBoidsSeparation);
        }

        alignFinal = this.checkAlign(totalLocalBoidsAlign, steeringAlign);
        cohesionFinal = this.checkCohesion(totalLocalBoidsCohesion, steeringCohesion);
        separationFinal = this.checkSeparation(totalLocalBoidsSeparation, steeringSeparation);

        // alignFinal = alignFinal*(alignSlider.value());
        // cohesionFinal = cohesionFinal*(cohesionSlider.value());
        // separationFinal = separationFinal*(separationSlider.value());

        alignFinal.mult(alignSlider.value());
        cohesionFinal.mult(cohesionSlider.value());
        separationFinal.mult(separationSlider.value());


        this.acceleration.add(alignFinal);
        this.acceleration.add(cohesionFinal);
        this.acceleration.add(separationFinal);
    }
}

