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
        this.maxSpeed = 6;
        this.perception = random(20, 100);
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
        }
        if (totalLocalBoids > 0) {
            steering.div(totalLocalBoids);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce); //limit the magnitude
        }
        return steering;
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

    flock(boids)
    {
        this.acceleration.set(0, 0); //set acc to 0, so that the force doesnt accumulate
        let alignment = this.align(boids, this.perception);
        let cohesion = this.cohesion(boids, this.perception);
        let separation = this.separation(boids, this.perception);

        separation.mult(separationSlider.value());
        cohesion.mult(cohesionSlider.value());
        alignment.mult(alignSlider.value());

        this.acceleration.add(cohesion);
        this.acceleration.add(alignment);
        this.acceleration.add(separation);

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
}