---
title: Public cloud computing, explained
lastmod: 2021-08-06T06:51:05+01:00
publishdate: 2021-08-06T06:51:05+01:00
author: Azeez Lukman
draft: false
description: High level overview of the public cloud computing. 
tags: 
    - cloud

# youtube: 
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Public cloud computing provides a solution for businesses to consume computing services that usually exist on-premises over a network. Businesses and individuals can consume these services as required. You can think of it as a subscription-based model or a sort of on-demand service where businesses would only pay for their consumption.

The public cloud is one of the three types of cloud computing services, these include

- The private cloud computing
- The public cloud computing
- Hybrid cloud computing

Public cloud can be consumed quickly as it requires no upfront investment and no capital or any serious planning sort of. Making use of the public cloud also means you only get to be responsible for certain aspects of the overall model. The aspects you are responsible for depends on the type of public cloud service you are making use of. We would explore the types of public cloud services in this article. 

How about we take a look at a scenario where you can make use of a public cloud service.

## Public Cloud Computing Scenario

A good scenario where public cloud can come into play is when training machine learning models. This can require lots of computing power which at times is much more than your local machine can provide. I've had situations where my CPU usage keeps rising and my fan keeps whirring up and still takes a lot of time, most times an option I take is to leave it to run and come back to work, another option I can take is to replace my machine with one that's of much higher specifications, but it's only a matter of time before I need another replacement. You can agree with me, that's rather stressful and costly. 

A better alternative would be for me to leverage the public cloud where I would not necessarily need to upgrade my machine, I easily get the compute power I need with all other technicalities and bottlenecks abstracted away, saving me time and money.

## The Magic In Public Cloud Computing

You might be wondering how it all works, it might seem like magic at first, maybe it is, how is this even possible? Allow me to do justice to that, it's no magic, there still exists a physical infrastructure running somewhere. The supporting services like database servers, disk servers and networking still exists but are completely abstracted away from the user, so they get to focus only on the services they need. You might now wonder if this infrastructure is set up in the clouds up in the sky, again that's not true. They are set up on the earth, a place set up to house support services for the public cloud is called a data centre.

A public cloud provider usually has several data centres distributed at different parts of the world, allowing services to be provided to users from the closest data centre to them. This ensures requests are served as fast as possible. The maintenance of these data centres and their infrastructure is done by the cloud provider.

## Why Public Cloud

The public cloud is cool but why should you make use of it, Let’s see if the public cloud is really worth the hype.

### Scalability

Cloud capacity and resources rapidly expand to meet user demands and traffic spikes. Public cloud users also achieve greater redundancy and high availability due to the providers' various, logically separated cloud locations. In addition to redundancy and availability, public cloud users receive faster connectivity between cloud services and end-users via their provider's network interfaces.

### Flexibility

The flexible and scalable nature of public cloud storage enables users to store high volumes of data and access them easily. Many organizations rely on the cloud for disaster recovery, to back up data and applications in case of emergency or outage. It's tempting to store all data indefinitely, but users should set up a data retention policy that regularly deletes old data from storage to avoid long-term storage costs and to maintain privacy.

### Cost-effectiveness

Cloud computing is probably the most cost-efficient method to use to maintain and upgrade your IT infrastructure. Since you only pay for the services you use it makes it possible for businesses of any size to save the cost of maintaining on-premises infrastructure like compute, storage, networking and security.

Businesses worry less about maintenance and keeping the infrastructure running. This is done by the cloud provider.

### Automation

Cloud automation is essential to a successful transition to leveraging cloud infrastructure and can include tasks such as automated storage and backups, managing security and compliance, changing configurations and settings, and deploying code.

Automation tools help ensure optimal performance from the system and its resources by streamlining activities that relate to cloud computing, and can further improve efficiency by reducing the need for IT teams to manage repetitive tasks or make decisions about capacity or performance in real-time.

### Sandbox testing

Public cloud providers generally provide an isolated testing environment that enables users to run programs or execute files without affecting the application, system or platform on which they run.

The sandbox environment virtual machine isolated away from your production environment in which potentially unsafe software code can execute without affecting network resources or local applications. Cybersecurity researchers use sandboxes to run suspicious code from unknown attachments and URLs and observe its behaviour.

### Staged migration

The general goal or benefit of any cloud migration is to host applications and data in the most effective IT environment possible, based on factors such as cost, performance and security.

Businesses, especially ones with existing on-premises data centres, would prefer to gradually migrate it to the cloud. Cloud providers enable businesses to migrate existing data and applications to the cloud in a gradual process. This facility has a low risk of losing data during migration.

## Types of public cloud computing

Cloud computing follows a service-driven architecture, where services are categorized based on how they would be consumed. The main difference is the level of access and control to which you as the customer gets to be responsible for various aspects of the cloud service. These aspects include the application, data, runtime middleware, operating systems, virtualization, servers, storage and networking.

### Infrastructure as a service

{{< figure src="img/iaaS.jpg" caption="Diagram of Infrastructure as a service solution responsibility level" >}}

IaaS allows you to run virtual machines configured to specifications you require on the cloud provider's infrastructure. Allowing you the leverage the computing resources you require.

When you leverage IaaS,  you are responsible for the applications, data, runtime, middleware and operating system. The provider takes care of the virtualization, the servers, storage and networking.

Setting up an IaaS requires you to configure your hardware from a range of predefined options which include the ram and storage you would like to use. The options are predefined because obviously, the cloud provider cannot cater for all custom specifications ahead of the customer's request. One essence of public cloud computing is to clear this kind of blocker. 

After configuring your hardware, next is the operating system. Most cloud providers support different operating systems which you can select from, the selected OS is then preconfigured.

Keep in mind that the size and kind of resources you assign to your VM directly affects the cost, the higher the resources, the higher the cost.

Examples of IaaS services are DigitalOcean, AWS and Google Compute Engine (GCE).

### Platform as a service

{{< figure src="img/paaS.jpg" caption="Diagram of platform as a service solution responsibility level" >}}

PaaS delegate the responsibility of just the applications and data to the consumer, while the public cloud provider is responsible for the rest of the supporting resources and infrastructure.

PaaS solutions are frequently used in the development of mobile applications. However, many developers and companies also use PaaS to build cross-platform apps because it provides a flexible and dynamic solution that has the ability to create an application that can be operated on almost any device.

It is provided through a cloud service provider's hosted infrastructure. Users most frequently access the offerings through a web browser.

PaaS products include AWS Elastic Beanstalk and Google App Engine.

### Software as a service

{{< figure src="img/saaS.jpg" caption="Diagram of software as a service solution responsibility level" >}}

SaaS provides a solution to provide users with a complete software solution running on the cloud provider's infrastructure such that customers need to make little to no configurations.

The supporting resources and infrastructure are completely managed and maintained by the cloud provider, abstracted away from the consumer.

End users are more familiar with SaaS platforms in their everyday usage. SaaS-based platforms include web-based email, streaming platforms, social networks and a couple of others.

Examples of SaaS include Salesforce, Dropbox and Google Workspace. 

## Summary

Public cloud is simply a way for you to leverage the internet to make use of someone else's computing infrastructure while paying for only what you use.

Leveraging this kind of service makes you and your business eligible to benefit from all the flexibility,  scalability, automation and cost-effectiveness it provides.

It's categorized by a service-driven architecture into IAAS, PAAS and SAAS. The difference is how much of the underlying infrastructure you get to make decisions on.

## Conclusion

This is a high-level overview of the public cloud, so of course, there are aspects we did not cover in this article but this is a good headstart.

Thank you for reading 🙂. Got any questions, suggestions or comments? Let's continue in the comments section. Please follow me on Twitter, LinkedIn and Github @robogeek95.

## References

[https://searchcloudcomputing.techtarget.com/definition/Platform-as-a-Service-PaaS](https://searchcloudcomputing.techtarget.com/definition/Platform-as-a-Service-PaaS)

[https://www.appdynamics.com/topics/what-is-cloud-automation](https://www.appdynamics.com/topics/what-is-cloud-automation)

[https://www.google.com/amp/s/searchcloudcomputing.techtarget.com/definition/cloud-migration](https://www.google.com/amp/s/searchcloudcomputing.techtarget.com/definition/cloud-migration%3famp=1)