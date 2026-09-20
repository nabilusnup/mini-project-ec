<?php

namespace App\Services;

use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\ClientBuilder;

class ElasticsearchService
{
    protected Client $client;

    public function __construct()
    {
        $builder = ClientBuilder::create();
        $cloudId = config('services.elasticsearch.cloud_id');
        $apiKey = config('services.elasticsearch.api_key');

        if ($cloudId && $apiKey) {
            $builder
                ->setElasticCloudId($cloudId)
                ->setApiKey($apiKey);
        } else {
            $builder->setHosts([config('services.elasticsearch.host')]);
        }

        $this->client = $builder->build();
    }

    public function client(): Client
    {
        return $this->client;
    }
}
